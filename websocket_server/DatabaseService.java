package websocket_server;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import net.sf.json.JSONObject;

public class DatabaseService {
	
	private Connection con;
	private Statement stat;
	private final String dbhost="127.0.0.1:3306";
	private final String dbname="imagerect";
	private final String user="imagerect";//rect
	private final String pass="ZqH0Em0Bf3nocOlW";
	
	public static DatabaseService dbservice=new DatabaseService();
	
	public DatabaseService(){
		try {
			Class.forName("com.mysql.jdbc.Driver");
			con=DriverManager.getConnection("jdbc:mysql://"+dbhost+"/"+dbname+"?user="+user+"&password="+pass+"&useUnicode=true&characterEncoding=UTF8&useSSL=true");
			stat=con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public int insDimen(int nwidth,int nheight){
		try {
			if(con.isClosed()){
				con=DriverManager.getConnection("jdbc:mysql://"+dbhost+"/"+dbname+"?user="+user+"&password="+pass+"&useUnicode=true&characterEncoding=UTF8&useSSL=true");
				stat=con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			}
			ResultSet rs=stat.executeQuery("select * from dimensions");
			rs.moveToInsertRow();
			rs.updateInt("width", nwidth);
			rs.updateInt("height", nheight);
			rs.insertRow();
			rs.last();
			return rs.getInt("id");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return -1;
	}
	
	public void insRect(int id,JSONObject obj){
		try {
			if(con.isClosed()){
				con=DriverManager.getConnection("jdbc:mysql://"+dbhost+"/"+dbname+"?user="+user+"&password="+pass+"&useUnicode=true&characterEncoding=UTF8&useSSL=true");
				stat=con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			}
			ResultSet rs=stat.executeQuery("select * from rectangles");
			rs.moveToInsertRow();
			rs.updateInt("dimen", id);
			rs.updateInt("num",obj.getInt("num"));
			rs.updateInt("width", obj.getInt("width"));
			rs.updateInt("height", obj.getInt("height"));
			rs.updateInt("x", obj.getInt("x"));
			rs.updateInt("y", obj.getInt("y"));
			rs.insertRow();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
