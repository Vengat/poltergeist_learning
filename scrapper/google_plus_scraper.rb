# Add the mixin
require './capybara_with_phantomjs'
 
# Google+ Scraper
#
# === Example
#
#   g_plus = GooglePlusScraper.new(111044299943603359137)
#   data = g_plus.to_h
#   # => { id: 111044299943603359137, in_circles: 1234, timestamp: 123456789 }
#
class GooglePlusScraper
  include CapybaraWithPhantomJs
 
  def initialize(profile_id)
    @profile_id = profile_id
  end
 
  # Return a hash
  def to_h
    data = {
      :id => @profile_id,
      :in_circles => in_circles,
      :timestamp => Date.today.to_datetime.to_i
    }
  end
 
  # Return the circle count as an integer
  def in_circles
    matches = tp_tx_hp
    return 0 if matches.nil?
    str = matches.find { |s| s.include?('have them in circles') }
    (str.nil?) ? 0 : Integer(str.gsub(/,/, '').match(/\d+/)[0])
  end
 
  # Return the text found in H3 tags
  def tp_tx_hp
    results = google_plus_page.search('//h3[@class="TP tx hp"]/span')
    results = results.collect(&:text)
    return nil if results.empty?
    results
  end
 
  # Get the Google Plus page and locally cache it in an instance variable
  def google_plus_page
    unless @google_plus_page
      new_session
      puts 'Im visiting :)'
      visit "https://plus.google.com/u/0/#{@profile_id}/posts"
      sleep 5 # give phantomjs 5 seconds and let the page fill itself in
      @google_plus_page = Nokogiri::HTML.parse(html)
    end
    @google_plus_page
  end
 
end

g_plus = GooglePlusScraper.new(111044299943603359137)
data = g_plus.to_h
