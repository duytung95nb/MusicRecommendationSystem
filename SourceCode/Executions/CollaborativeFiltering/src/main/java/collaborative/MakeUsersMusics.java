package collaborative;
import org.apache.spark.api.java.function.Function;

import scala.Tuple2;

public class MakeUsersMusics implements Function<Tuple2<Integer, String>, Tuple2<Integer, Integer>> {

	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;
	private int userID;

	public MakeUsersMusics(int userID) {
		// TODO Auto-generated constructor stub
		this.userID = userID;
	}

	public Tuple2<Integer, Integer> call(Tuple2<Integer, String> music) throws Exception {
		// TODO Auto-generated method stub
		
		return new Tuple2<Integer, Integer>(userID, music._1());
	}

}
