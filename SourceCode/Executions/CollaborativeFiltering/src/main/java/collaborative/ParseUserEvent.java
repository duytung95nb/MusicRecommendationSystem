package collaborative;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.spark.api.java.function.Function;
import org.apache.spark.mllib.recommendation.Rating;

public class ParseUserEvent implements Function<String, Rating> {
	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;

	public Rating call(String userEvent) throws Exception {
		List<String> holder = new ArrayList<String>();
		Pattern pattern = Pattern.compile("\"([^\"]*)\"");
		Matcher matcher = pattern.matcher(userEvent);
		
		while (matcher.find()) {
			String userEventData = matcher.group(1).trim();
			holder.add(userEventData);
		}
		
		return new Rating(Integer.parseInt(holder.get(0)), 
						  Integer.parseInt(holder.get(1)), 
						  Double.parseDouble(holder.get(2)));
	}

}
