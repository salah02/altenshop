using System.Text.Json;

namespace AltenShop.Api.Services
{
    public class JsonFileService<T>
    {
        private readonly string _filePath;

        public JsonFileService(string fileName)
        {
            _filePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Data", fileName);
            _filePath = Path.GetFullPath(_filePath);
        }

        public T? Read()
        {
            if (!File.Exists(_filePath))
                return default;

            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public void Save(T data)
        {
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            using (var stream = new FileStream(_filePath, FileMode.Create, FileAccess.Write, FileShare.None))
            using (var writer = new StreamWriter(stream))
            {
                writer.Write(json);
            }
        }
    }
}
