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
        public string connectionID { get; set; }
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

    //    public RoomType roomType { get; set; }

    //    public enum RoomType
    //    {
    //        [Description("Mulher")]
    //        mulher = 0,
    //        [Description("Homem")]
    //        homem = 1,
    //        [Description("Ambos")]
    //        ambos = 2
    //    }
    }

    public class ChatHub : Hub
    {
        ILogger _logger;
        private readonly List<Users> usersConnect = new List<Users>();
        private readonly Dictionary<string, string> pairs = new Dictionary<string, string>();

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public async Task Search(Users users)
        {
            if(!usersConnect.Where(x => x.connectionId == Context.ConnectionId).Any())
            {
                users.connectionId = Context.ConnectionId;
                usersConnect.Add(users);
            }

            if (usersConnect.Where(x => (x.sexoProcurando == users.sexo || x.sexoProcurando == "ambos") && x.sexo == users.sexoProcurando && x.connectionId != Context.ConnectionId).Any())
            {
                var userMatch = usersConnect.Where(x => (x.sexoProcurando == users.sexo || x.sexoProcurando == "ambos") && x.sexo == users.sexoProcurando).FirstOrDefault();
                var user = usersConnect.Where(x => x.connectionId == Context.ConnectionId).FirstOrDefault();

                await Clients.Client(Context.ConnectionId).SendAsync("Match");
                await Clients.Client(userMatch.connectionId).SendAsync("Match");

                _logger.LogInformation($"Match dos usuarios {userMatch.connectionId} & {user.connectionId}");

                
                pairs.Add(Context.ConnectionId, userMatch.connectionId);
                pairs.Add(userMatch.connectionId, Context.ConnectionId);
                usersConnect.Remove(userMatch);
                usersConnect.Remove(user);
            }

            _logger.LogInformation($"{users} foi conectado");
        }

        //public override Task OnDisconnectedAsync(Exception exception)
        //{
        //    //var conect = usersConnect.FirstOrDefault(z => z.connectionId == Context.ConnectionId);

        //    if (conect != null)
        //        usersConnect.Remove(conect);

        //    _logger.LogInformation($"{conect} foi desconectado");

        //    return base.OnDisconnectedAsync(exception);
        //}

        public async Task SendMessage(Message message)
        {

            var idFromConnection = Context.ConnectionId;
            //var _toUser = toUserId;
            //var idToConnection = usersConnect.Where(x => x.connectionId == _toUser).Select(z => z.connectionId).ToString();

            //if (idFromConnection.Any())
            //{
            //    await Clients.Client(idToConnection).SendAsync("SendMessage", message.msg);

            //    _logger.LogInformation($"Mensagem enviada para {idToConnection}");
            //}

            //if (idToConnection.Any())
            //{
            //    await Clients.Client(idFromConnection).SendAsync("SendMessage", message.msg);

            //    _logger.LogInformation($"Mensagem enviada para {idFromConnection}");
            //}

        }

        //public async Task Search(Sexo sexo, string otherUserId)
        //{
        //    var connect1 = usersConnect.Where(x => x.connectionId == otherUserId).FirstOrDefault();
        //    var connect2 = usersConnect.Where(x => x.connectionId == Context.ConnectionId).FirstOrDefault();

        //    //if (connect1.sexo == sexo && connect2.sexo == sexo)
        //    //{
        //    //    await Connect(sexo, otherUserId);
        //    //}

        //}
    }
}
