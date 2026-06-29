using Microsoft.Extensions.Configuration;
using System;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using OpenAI;
using Resume.Core.IServices;
using Resume.Core.Models;
using Resume.Data;
using Xceed.Words.NET;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using PdfTextExtractor = iText.Kernel.Pdf.Canvas.Parser.PdfTextExtractor;
using PdfDocument = iText.Kernel.Pdf.PdfDocument;
using PdfReader = iText.Kernel.Pdf.PdfReader;
using Resume.Core.IRepository;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Resume.Core.DTOs;

namespace Resume.Service.Services
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IAIRepository _IaIRepository;
        private readonly IMapper _mapper;
        private readonly string _myApiKey;

        public AIService(IConfiguration config, OpenAIClient openAI, IAIRepository aIRepository, IMapper mapper)
        {
            _httpClient = new HttpClient();
            _myApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            _IaIRepository = aIRepository;
            _mapper = mapper;
        }

        public async Task<AIResponse> GetAIResponseById(int aiId)
        {
            return await _IaIRepository.GetAIResponseByIdAsync(aiId);
        }
        private string PreprocessResumeText(string rawText)
        {
            // הפוך שורות שנראות כתובות מימין לשמאל בסדר הפוך
            var cleanedText = rawText;

            // ניקוי תווים מוזרים
            cleanedText = cleanedText.Replace("\u200f", "").Replace("\u202b", "").Replace("\u202c", "");

            return cleanedText;
        }

        private bool IsProbablyHebrew(string line)
        {
            return line.Any(c => c >= '\u0590' && c <= '\u05FF');
        }

        private string ReverseHebrewLine(string line)
        {
            var trimmed = line.Trim();
            // לדוגמה: " :שמח" -> "שם: "
            return new string(trimmed.Reverse().ToArray());
        }

        public async Task AddAiResponseAsync(IFormFile resumeFile, int userId)
        {
            string fileName = resumeFile.FileName;
            string extension = Path.GetExtension(fileName).ToLowerInvariant();

            string resumeText = extension switch
            {
                ".pdf" => ExtractTextFromPdf(resumeFile),
                ".docx" => ExtractTextFromDocx(resumeFile),
                _ => throw new ArgumentException("Unsupported file extension.", nameof(extension)),
            };

            await AnalyzeResumeAsync(resumeText, userId, fileName);
        }

        private async Task AnalyzeResumeAsync(string resumeText, int userId, string fileName)
        {
            // שלב ניקוי
            var cleanedText = PreprocessResumeText(resumeText);

            var prompt = @$"
אתה מקבל טקסט של קורות חיים בעברית שעשוי להיות לא מסודר או כתוב מימין לשמאל.
המטרה שלך היא להוציא את השדות הבאים בלבד, לפי מה שמופיע בטקסט:

- FirstName
- LastName
- FatherName
- MotherName
- Address
- Age
- Height
- Occupation
- PlaceOfStudy

אם לא ניתן לדעת את אחד השדות – השאר אותו ריק. החזר פלט **בפורמט JSON בלבד וללא הסברים**.

הטקסט:

{cleanedText}";

            var request = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
            new { role = "system", content = "אתה עוזר חכם לפענוח קורות חיים." },
            new { role = "user", content = prompt }
        },
                temperature = 0.2
            };

            var requestBody = JsonSerializer.Serialize(request);
            var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _myApiKey);

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"AI request failed: {response.StatusCode} - {responseBody}");

            var json = JsonDocument.Parse(responseBody);
            var rawContent = json.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            if (string.IsNullOrWhiteSpace(rawContent))
                throw new Exception("AI response is empty.");

            var cleaned = rawContent.Replace("```json", "").Replace("```", "").Trim();

            var aiResponse = JsonSerializer.Deserialize<AIResponse>(cleaned, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (aiResponse == null)
                throw new Exception("Failed to parse AI response.");

            await _IaIRepository.AddAiResponseAsync(aiResponse, userId, fileName);
        }

        private string ExtractTextFromPdf(IFormFile pdfFile)
        {
            using var stream = pdfFile.OpenReadStream();
            using var reader = new PdfReader(stream);
            using var pdfDoc = new PdfDocument(reader);
            var text = new StringBuilder();

            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                text.Append(PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i)));
                text.AppendLine();
            }

            return text.ToString();
        }

        private string ExtractTextFromDocx(IFormFile file)
        {
            using var stream = new MemoryStream();
            file.CopyTo(stream);
            stream.Position = 0;
            using var doc = DocX.Load(stream);
            return doc.Text;
        }

        public Task<IEnumerable<AIResponse>> GetAllAIResponsesAsync() =>
            _IaIRepository.GetAllAIResponsesAsync();

        public Task<IEnumerable<AIResponse>> GetFilesByUserIdAsync(int userId) =>
            _IaIRepository.GetFilesByUserIdAsync(userId);

        public Task<IEnumerable<AIResponse>> GetPermittedFilesForUserAsync(int userId) =>
            _IaIRepository.GetPermittedFilesForUserAsync(userId);

        public async Task DeleteAllAIResponsesAsync() =>
            await _IaIRepository.DeleteAllAIResponsesAsync();

        public async Task DeleteAiResponseById(int aiResponseId) =>
            await _IaIRepository.DeleteAiResponseById(aiResponseId);

        public async Task<AIResponse?> UpdateAIResponseAsync(int id, UpdateAIResponseDTO dto)
        {
            var response = await _IaIRepository.GetAIResponseByIdAsync(id);
            if (response == null) return null;

            // Map fields
            response.FirstName = dto.FirstName ?? response.FirstName;
            response.FatherName = dto.FatherName ?? response.FatherName;
            response.MotherName = dto.MotherName ?? response.MotherName;
            response.LastName = dto.LastName ?? response.LastName;
            response.Address = dto.Address ?? response.Address;
            response.PlaceOfStudy = dto.PlaceOfStudy ?? response.PlaceOfStudy;
            response.Occupation = dto.Occupation ?? response.Occupation;
            response.Height = dto.Height ?? response.Height;
            response.Age = dto.Age ?? response.Age;

            return await _IaIRepository.UpdateAIResponseAsync(response);
        }
    }
}
