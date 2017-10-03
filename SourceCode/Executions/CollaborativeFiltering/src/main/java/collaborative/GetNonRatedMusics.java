package collaborative;
import java.util.List;

import org.apache.spark.api.java.function.Function;

import scala.Tuple2;

public class GetNonRatedMusics implements Function<Tuple2<Integer, String>, Boolean> {

	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;
	
	private List<Integer> ratedMusicIDsOfUser;
	
	public GetNonRatedMusics(List<Integer> ratedMusicIDsOfUser) {
		this.ratedMusicIDsOfUser = ratedMusicIDsOfUser;		
	}

	public Boolean call(Tuple2<Integer, String> music) throws Exception {
		if (ratedMusicIDsOfUser.contains(music._1())) {
			return false;
		}
		return true;
	}	

}
