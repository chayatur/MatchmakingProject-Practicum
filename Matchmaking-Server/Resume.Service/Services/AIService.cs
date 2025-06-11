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
            _myApiKey = config["OpenAI:ApiKey"];
            _IaIRepository = aIRepository;
            _mapper = mapper;
        }

        public async Task<AIResponse> GetAIResponseById(int aiId)
        {
            return await _IaIRepository.GetAIResponseByIdAsync(aiId);
        }
        
        public async Task AddAiResponseAsync(IFormFile resumeFile, int userId)
        {
            string fileName = resumeFile.FileName;
            Console.WriteLine("ai in service");
            string extention = Path.GetExtension(fileName);
            if (string.IsNullOrEmpty(extention)) throw new ArgumentException("Extension is required.", nameof(extention));

            if (extention.Contains("pdf", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("if1");
                var resumeText = ExtractTextFromPdf(resumeFile);
                await AnalyzeResumeAsync(resumeText, userId, fileName);
            }
            else if (extention.Contains("docx", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("if2");
                var resumeText = ExtractTextFromDocx(resumeFile);
                await AnalyzeResumeAsync(resumeText, userId, fileName);
            }
            else
            {
                Console.WriteLine("if3");
                throw new ArgumentException("Unsupported file extension.", nameof(extention));
            }
        }

        private async Task AnalyzeResumeAsync(string resumeText, int userId, string fileName)
        {
            if (string.IsNullOrWhiteSpace(resumeText))
                throw new ArgumentException("Resume text cannot be null or empty.", nameof(resumeText));

            if (string.IsNullOrEmpty(_myApiKey))
            {
                throw new Exception("API key is not set. Please check your configuration.");
            }
            Console.WriteLine("ai analayze");
            var request = new
            {
                model = "gpt-4o-mini", // Ensure this model is correct
                messages = new[] {
                    new { role = "system", content = "You are an AI that extracts information from a resume file." },
                    new { role = "user", content = $"Extract the following information: " +
                        $"Occupation, Height, Age, PlaceOfStudy, " +
                        $"FirstName, FatherName, MotherName, LastName, Address " +
                        $"Return them in JSON format.\n\n{resumeText}" }
                },
                temperature = 0.5
            };

            var requestBody = JsonSerializer.Serialize(request);
            var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _myApiKey);

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
            Console.WriteLine(  "before send");
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("after send");
            if (!response.IsSuccessStatusCode)
                throw new Exception($"AI request failed with status code {response.StatusCode}: {responseBody}");

            using var document = JsonDocument.Parse(responseBody);
            string messageContent = document.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();
            if (string.IsNullOrEmpty(messageContent))
                throw new Exception("AI response is empty.");
            Console.WriteLine("get answer");
            Console.WriteLine(messageContent);
            messageContent= messageContent.Substring(7);
            messageContent = messageContent.Replace('`',' ');
            Console.WriteLine(messageContent);
            AIResponse aiResponse = JsonSerializer.Deserialize<AIResponse>(messageContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            Console.WriteLine("after seriliize");
            if (aiResponse == null)
                throw new Exception("Failed to parse AI response.");
            Console.WriteLine(aiResponse+" aiResponse");
            await _IaIRepository.AddAiResponseAsync(aiResponse, userId, fileName);
        }

        private string ExtractTextFromPdf(IFormFile pdfFile)
        {
            using (var stream = pdfFile.OpenReadStream()) // השתמש במתודה הזו
            using (PdfReader reader = new PdfReader(stream))
            using (PdfDocument pdfDoc = new PdfDocument(reader))
            {
                StringWriter stringWriter = new StringWriter();

                for (int page = 1; page <= pdfDoc.GetNumberOfPages(); page++)
                {
                    string pageText = PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(page));
                    stringWriter.Write(pageText);
                }

                return stringWriter.ToString();
            }
        }

        private string ExtractTextFromDocx(IFormFile resumeFile)
        {
            Console.WriteLine("ai extract");
            if (resumeFile == null || resumeFile.Length == 0)
            {
                throw new ArgumentException("File is missing or empty.");
            }

            using var stream = new MemoryStream();
            resumeFile.CopyTo(stream);
            stream.Position = 0;
            using var doc = DocX.Load(stream);
            return doc.Text;
        }

        public Task<IEnumerable<AIResponse>> GetAllAIResponsesAsync()
        {
            return _IaIRepository.GetAllAIResponsesAsync();
        }

        public Task<IEnumerable<AIResponse>> GetFilesByUserIdAsync(int userId)
        {
            return _IaIRepository.GetFilesByUserIdAsync(userId);
        }

        public async Task UpdateAIResponseAsync(int id, AIResponse aiResponse) // עדכון עם שני פרמטרים
        {
            if (aiResponse == null)
            {
                throw new ArgumentException("AIResponse cannot be null.", nameof(aiResponse));
            }

            await _IaIRepository.UpdateAIResponseAsync(id, aiResponse); // קריאה למתודה בממשק ה-Rrepository
        }


        //public async Task UpdateAIResponseAsync(AIResponse aiResponse)
        //{
        //    await _IaIRepository.UpdateAIResponseAsync(aiResponse);
        //}

        public async Task DeleteAIResponseAsync(int id)
        {
            await _IaIRepository.DeleteAIResponseAsync(id);
        }
        public async Task DeleteAllAIResponsesAsync()
        {
            await _IaIRepository.DeleteAllAIResponsesAsync();
        }
    }
}
