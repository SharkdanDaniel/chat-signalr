using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace ChatSignalR.Hubs
{
    public class Message
    {
        public string type { get; set; }
        public string msg { get; set; }
        public DateTime date { get; set; }
    }

    public class Users
    {
        public string nome { get; set; }
        public RoomType roomType { get; set; }

        public Users(string nome)
        {
            this.nome = nome;
        }

        public enum RoomType
        {
            [Description("Mulher")]
            mulher = 0,
            [Description("Homem")]
            homem = 1,
            [Description("Ambos")]
            ambos = 2
        }
    }

    public class ChatHub : Hub
    {
        ILogger _logger;
        private readonly Dictionary<string, string> connection = new Dictionary<string, string>();

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;

            if (connection.Count(x => x.nome == connectionId) == 0)
                connection.Add(new Users(connectionId));

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;

            var conectado = connection.FirstOrDefault(x => x.nome == connectionId);

            if (conectado != null)
                connection.Remove(conectado);

            //await Groups.RemoveFromGroupAsync(message.nome, message.roomType.ToString());
            _logger.LogInformation($"{connectionId} desconectado");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(Message message)
        {
            var connectionId = Context.ConnectionId;
            var outroUser = connection.Where(x => x.nome == connectionId).FirstOrDefault();

            
            await this.Clients.Client(outroUser.nome).SendAsync("ReceiveMessage", message);

            _logger.LogInformation($"Mensagem enviada com sucesso: {message}");
        }
    }
}
