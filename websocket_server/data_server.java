package websocket_server;

import java.io.IOException;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@ServerEndpoint(value="/mark")
public class data_server {

		private Session session;

		@OnOpen
		public void onOpen(Session session) {
			this.session = session;
			//System.out.println("incoming connection");
		}

		@OnClose
		public void onClose() {
		}

		@OnMessage
		public void onMessage(String message, Session session) {
			//System.out.println(message);
			JSONObject jsonObj=JSONObject.fromObject(message);
			int id=DatabaseService.dbservice.insDimen(jsonObj.getInt("nwidth"),jsonObj.getInt("nheight"));
			//System.out.println("current id:"+id);
			JSONArray arr=jsonObj.getJSONArray("rects");
			int size=arr.size();
			for(int i=0;i<size;i++)
				DatabaseService.dbservice.insRect(id, arr.getJSONObject(i));
		}

		@OnError
		public void onError(Session session, Throwable error) {
			error.printStackTrace();
		}

		public void sendMessage(String message) throws IOException {
			this.session.getBasicRemote().sendText(message);
		}

}
