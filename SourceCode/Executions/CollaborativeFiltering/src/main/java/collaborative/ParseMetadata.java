package collaborative;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.spark.api.java.function.Function;

import scala.Tuple2;

public class ParseMetadata implements Function<String, Tuple2<Integer, String>>{

	/**
	 * Random ID
	 */
	private static final long serialVersionUID = 1L;

	public Tuple2<Integer, String> call(String item) throws Exception {
		List<String> holder = new ArrayList<String>();
		Pattern pattern = Pattern.compile("\"([^\"]*)\"");
		Matcher matcher = pattern.matcher(item);
		
		while (matcher.find()) {
			String itemFactor = matcher.group(1).trim();
			holder.add(itemFactor);
		}
		
		return new Tuple2<Integer, String>(Integer.parseInt(holder.get(0)), holder.get(1));
	}

	

}
