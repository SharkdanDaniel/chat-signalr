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
        public string Name { get; set; }
        public string connectionId { get; set; }
        public string sexo { get; set; }
        public string sexoProcurando { get; set; }
    }

    public class ChatHub : Hub
    {
        ILogger _logger;
        static List<Users> usersConnect = new List<Users>();
        static Dictionary<string, string> pairs = new Dictionary<string, string>();

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public async Task Search(Users users)
        {
            if (!usersConnect.Where(x => x.connectionId == Context.ConnectionId).Any())
            {
                users.connectionId = Context.ConnectionId;
                usersConnect.Add(users);
            }

            if (usersConnect.Where(x => (x.sexoProcurando == users.sexo || x.sexoProcurando == "ambos") && x.sexo == users.sexoProcurando && x.connectionId != Context.ConnectionId).Any())
            {
                var userMatch = usersConnect.Where(x => (x.sexoProcurando == users.sexo || x.sexoProcurando == "ambos") && x.sexo == users.sexoProcurando).FirstOrDefault();
                var user = usersConnect.Where(x => x.connectionId != userMatch.connectionId).FirstOrDefault();
                  
                await Clients.Client(Context.ConnectionId).SendAsync("Match");
                await Clients.Client(userMatch.connectionId).SendAsync("Match");

                pairs.Add(Context.ConnectionId, userMatch.connectionId);
                pairs.Add(userMatch.connectionId, Context.ConnectionId);
                usersConnect.Remove(userMatch);
                usersConnect.Remove(user);
            }

           _logger.LogInformation($"{users} foi conectado");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (pairs.ContainsKey(Context.ConnectionId))
            {
                var outroId = pairs[Context.ConnectionId];
                await Clients.Client(pairs[Context.ConnectionId]).SendAsync("Disconnect");
                pairs.Remove(Context.ConnectionId);
                pairs.Remove(outroId);
            }

            if(usersConnect.Where(x => x.connectionId == Context.ConnectionId).Any())
            {
                usersConnect.Remove(usersConnect.Where(x => x.connectionId == Context.ConnectionId).FirstOrDefault());
            }
        }

        public async Task SendMessage(Message message)
        {
            if(pairs.ContainsKey(Context.ConnectionId))
            {
                await Clients.Client(Context.ConnectionId).SendAsync("SentMessage");
                await Clients.Client(pairs[Context.ConnectionId]).SendAsync("ReceiveMessage", message);
            }
        }

        public async Task ReceivedMessage()
        {
            if(pairs.ContainsKey(Context.ConnectionId))
            {
                await Clients.Client(pairs[Context.ConnectionId]).SendAsync("IsReceivedMessage");
            }
        }

        public async Task ReadMessage()
        {
            if (pairs.ContainsKey(Context.ConnectionId))
            {
                await Clients.Client(pairs[Context.ConnectionId]).SendAsync("IsReadMessage");
            }
        }
    }
}
