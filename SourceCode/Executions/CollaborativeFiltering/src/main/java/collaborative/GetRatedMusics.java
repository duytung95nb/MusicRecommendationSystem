package collaborative;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.mllib.recommendation.Rating;

public class GetRatedMusics implements Function<Rating, Boolean>{

	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;
	private int userID;

	public GetRatedMusics(int userID) {
		this.userID = userID;
	}

	public Boolean call(Rating rating) throws Exception {
		// TODO Auto-generated method stub
		if (rating.user() == userID) {
			return true;
		}
		return false;
	}

}
