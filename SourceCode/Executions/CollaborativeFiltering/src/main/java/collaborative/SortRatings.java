package collaborative;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.mllib.recommendation.Rating;

public class SortRatings implements Function<Rating, Double> {

	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;

	public Double call(Rating rating) throws Exception {
		return rating.rating();
	}

}
