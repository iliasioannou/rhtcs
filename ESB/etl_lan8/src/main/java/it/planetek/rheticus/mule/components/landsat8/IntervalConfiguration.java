package it.planetek.rheticus.mule.components.landsat8;


import org.joda.time.Days;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.mule.util.StringUtils;

/**
 * Classe che gestisce e calcola l'intervallo di configurazione per le ricerche nel catalogo landsat8
 *
 */
public class IntervalConfiguration {
	final static String DATE_FORMAT = "yyyy-MM-dd";
	private final int MIN_NUMBER_OF_DAYS = 0;
	private final int MAX_NUMBER_OF_DAYS = 50*365;

	private LocalDate from = null;
	private LocalDate to = null;
	private int numOfDays = 0;
	
	
	public IntervalConfiguration(String from, String to, String numOfDays) {
		super();
		this.from = parseToLocalDate(from);
		this.to = parseToLocalDate(to);
		this.numOfDays = sanitizeNumOfDays(convertNumOfDaysFromStringToInt(numOfDays));
		
		calculate();
	}


	public LocalDate getFrom() {
		return from;
	}

	public LocalDate getTo() {
		return to;
	}

	public String getFromAsString() {
		return formatDate(from);
	}
	
	public String getToAsString() {
		return formatDate(to);
	}

	
	static String getLocalDateFormat(){
		return DATE_FORMAT;
	}
	
	LocalDate getToday(){
		return new LocalDate();
	}
	
	
	String formatDate(final LocalDate dateToFormat){
		LocalDate date = sanitizeLocalDate(dateToFormat);
		return date.toString(DATE_FORMAT);
	}
	
	
	LocalDate parseToLocalDate(final String toParse) {
		String toParseSanitized = sanitizeString(toParse);
		LocalDate toReturn = null;
		DateTimeFormatter dateFormatter =  DateTimeFormat.forPattern(DATE_FORMAT);
		try {
			toReturn = dateFormatter.parseDateTime(toParseSanitized).toLocalDate();
		} catch (IllegalArgumentException e) {
			toReturn = new LocalDate();
		} catch (UnsupportedOperationException e) {
			toReturn = new LocalDate();
		}
		return toReturn;
	}	

	
	private void calculate(){
		if (isToday(from) && isToday(to) && (numOfDays > 0)){
			to = new LocalDate();
			from = to.minusDays(numOfDays);
		}
		else if ((isToday(from) == false) && isToday(to) && (numOfDays > 0)){
			to = from.plusDays(numOfDays);
		}
		else if (isToday(from) && (isToday(to) == false) && (numOfDays > 0)){
			from = to.minusDays(numOfDays);
		}
		
		if (isIntervalTooLarge() || isDateIntoFuture(from) || isDateIntoFuture(to) || isFromDateAfterTodate()){
			setDefaultDate();
		}
		
	}
	
	
	private boolean isToday(LocalDate date){
		return date.isEqual(new LocalDate());
	}
	
	private boolean isIntervalTooLarge(){
		return (Days.daysBetween(from, to).getDays() > MAX_NUMBER_OF_DAYS);
	}
	
	private boolean isDateIntoFuture(LocalDate date){
		LocalDate today = new LocalDate();
		return date.isAfter(today);
	}

	private boolean isFromDateAfterTodate(){
		return from.isAfter(to);
	}
	
	private void setDefaultDate(){
		from = new LocalDate();
		to = new LocalDate();
	}
	
	private LocalDate sanitizeLocalDate(final LocalDate date){
		if (date ==  null){
			return new LocalDate();
		}
		else{
			return date;
		}
	}

	private String sanitizeString(final String toSanitize){
		return StringUtils.trimToEmpty(toSanitize);
	}
	
	private int convertNumOfDaysFromStringToInt(final String numOfDaysToConvert){
		int numOfDays = 0; 
		if (StringUtils.isNumeric(numOfDaysToConvert)){
			try {
				numOfDays = Integer.parseInt(numOfDaysToConvert);
			} catch (NumberFormatException e) {
				numOfDays = 0;
			}
		}
		return numOfDays;
	}
	
	private int sanitizeNumOfDays(final int numOfDaysToSanitize){
		int numOfDaysToSanitized = 0;
		if ((numOfDaysToSanitize >= MIN_NUMBER_OF_DAYS) && (numOfDaysToSanitize <= MAX_NUMBER_OF_DAYS)){ 
			numOfDaysToSanitized = numOfDaysToSanitize;
		}
		return numOfDaysToSanitized;
	}
	


	
}
