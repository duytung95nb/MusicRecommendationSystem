package collaborative;

import org.apache.spark.api.java.function.Function;
import org.apache.spark.mllib.recommendation.Rating;

public class GetUsersExistInSystem implements Function<Rating, Integer> {

	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;

	public Integer call(Rating rating) throws Exception {
		
		return rating.user();
	}

}
