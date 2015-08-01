require './capybara_with_phantomjs'
require 'capybara/dsl'
require './image_detail'
require 'httpclient'
require 'open-uri'
#require './locators/pub_via_com_locator'

class PubViaComScrapper
	include CapybaraWithPhantomJs
	#include PubViaComLocator

	protected

	@new_session

    #showNumber = 0
    #row_number = 0
    #column_number = 0
	@show_link #= "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span[#{showNumber}]"
	@link_text #= @show_link + "/div[1]/a"
	#@link_text = "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span[#{showNumber}]/div[1]/a"
	@number_of_rows_of_images #= "//div[@id='dvImages']/div[2]/table/tr"
	@number_of_images_of_row #= "//div[@id='dvImages']/div[2]/table/tr[#{row_number}]/td"
	@image #= "//div[@id='dvImages']/div[2]/table/tr[#{row_number}]/td[#{column_number}]/table/tbody/table/tr[1]/td/a/img"
	@image_text #= "//div[@id='dvImages']/div[2]/table/tr[#{row_number}]/td[#{column_number}]/table/tbody/table/tr[2]/td/span/a"
	@show_data #= Hash.new 

	@httpclient

    public

    def initialize()
      @new_session = new_session     
      #Capybara.current_driver = @new_session.driver
      @httpclient = HTTPClient.new
      @show_data = Hash.new 

      showNumber = "showNumber"
      row_number = "row_number"
      column_number = "column_number"
      @show_link = "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span[#{showNumber}]"
	  @link_text = @show_link.to_s + "/div/a"
	  #@link_text = "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span[#{showNumber}]/div[1]/a"
	  @number_of_rows_of_images = "//div[@id='dvImages']/div[2]/table[@class=‘tblWrpr’]/tbody/tr"
	  @number_of_images_of_row = "//div[@id='dvImages']/div[2]/table[@class=‘tblWrpr’]/tbody/tr[#{row_number}]/td"
	  @image = "//div[@id='dvImages']/div[2]/table[@class=‘tblWrpr’]/tbody/tr[#{row_number}]/td[#{column_number}]/table/tbody/table/tr[1]/td/a/img"
	  @image_text = "//div[@id='dvImages']/div[2]/table[@class=‘tblWrpr’]/tbody/tr[#{row_number}]/td[#{column_number}]/table/tbody/table/tr[2]/td/span/a"

    end

	def get_titles
		results = @pub_via_com_page
	end

    #This method gets the show name or the link name
    def get_show_name showNumber
    	sleep 5
    	#return find(@show_link + @link_text).text
    	puts "___________________________"
    	puts showNumber
    	puts @show_link.to_s.sub("showNumber", showNumber.to_s)
    	puts find(@show_link.to_s.sub("showNumber", showNumber.to_s)).text
    	#puts find("//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span["+showNumber.to_s+"]/div[1]/a").text
    	puts "____________________________"
    	#return find("//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span["+showNumber.to_s+"]/div[1]/a").text
    	#return find(@link_text).text
    	#return find(@link_text.to_s.sub("showNumber", showNumber.to_s)).text
    	return find(@show_link.to_s.sub("showNumber", showNumber.to_s)).text
    end

    #Clicks the show link based on the number/index of the link    
	def click_show show_name
		sleep 20
		#click_link @show_link
		#puts @link_text.to_s.sub("showNumber", showNumber.to_s)
		#click_link @show_link.to_s.sub("showNumber", showNumber.to_s)
		#click_link @link_text.to_s.sub("showNumber", showNumber.to_s)
		#click_link show_name
		first(:link, show_name).click
		sleep 20
	end

    #This method iterates over the html table dom of the images section of the show
    #Removes the bracket that comes along with the image text
    #Adds image_text, image_src to image_details_array
    #Adds image_details_array to the array thats provided as the place holder for the image details
    #Returns the place holder array
    #Writes the image to disk
	def get_show_image_label(array)
		number_of_rows_of_images = all(:xpath, @number_of_rows_of_images.to_s).length
		puts "*********************************"
        puts number_of_rows_of_images
        puts @number_of_rows_of_images.to_s
		puts "*********************************"

		1.upto(number_of_rows_of_images) do |row_number|
		    number_of_images_of_row = all(:xpath, @number_of_images_of_row.to_s.sub("row_number", row_number.to_s)).length
		    puts "*********************************"
		    puts @number_of_images_of_row.to_s.sub("row_number", row_number.to_s)
            puts number_of_images_of_row
		    puts "*********************************"

		    1.upto(number_of_images_of_row) do |column_number|
		    	#image_details_array = Array.new
		    	image_src = @new_session.find(@image.to_s.sub("row_number", row_number.to_s).sub("column_number", column_number.to_s)).src
		    	image_text = @new_session.find(@image_text.to_s.sub("row_number", row_number.to_s).sub("column_number", column_number.to_s)).text
		    	image_text = image_text.sub(/\s+\(([A-Za-z0-9 ])+\)/, "")
		    	@img = ImageDetail.new(image_src, image_text)
                my_file = File.new("/Users/veramanan/poltergeist/images/"+image_text+".jpg", "wb")
                #<img style="height:125px;width:150px;border:2px #cfcfcf solid;" src="http://thepub.viacom.com/sites/vh1press/Shows/Show assets/911/_w/TorreiHartexwifeofKevinHart_jpg.jpg">
                #my_file.write(HTTPClient.new.get_content(URI::encode("http://thepub.viacom.com" + image_src)))
                #image_details_array[0] = image_text
                #image_details_array[1] = image_src
                array[(column_number-1)] = @img#image_details_array
                #Get the image src
                #Get the text associated with it    
		    end	
		end

		array

	end

    
    #This method populates the show_data hash with key as the show name and value as show_data_values array
    #Returns hash show_data
    #Calls another method get_show_image_label which does the job of parsing text with the image and downloading the image
    #Visit get_show_image_label for details of the implementation
	def gather_data_of_show show_name
		show_data_values = Array.new
        #get_show_image_label show_data_values
		@show_data[show_name] =  get_show_image_label(show_data_values)
		@show_data
	end

    
    #This method iterates over the number of shows displayed on the page
    #Starts by visiting the show home page
    #Calls the method gather_data_of_show
    def iterate_over_shows(maxShows)
       1.upto(maxShows) do |showNumber|
           visit "http://thepub.viacom.com/sites/vh1press/Pages/Home.aspx"
           sleep 30
           show_name = get_show_name(showNumber)
           click_show show_name
           sleep 30
           gather_data_of_show show_name        
       end
       @show_data
    end

    #This method returns the number of links (shows) displayed on the left
    def number_of_shows
        #number_of_shows = @pub_via_com_page.all(:xpath, "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span").length
        number_of_shows = all(:xpath, "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span").length
        puts number_of_shows
        number_of_shows       
    end


	def pub_via_com_page
		unless @pub_via_com_page
			#@new_session = new_session
			visit "http://thepub.viacom.com/sites/vh1press/Pages/Home.aspx"
			sleep 60
			@pub_via_com_page = Nokogiri::HTML.parse(html)
		end
		@pub_via_com_page
	end

end

mytest = PubViaComScrapper.new
puts mytest.pub_via_com_page
mytest.iterate_over_shows(mytest.number_of_shows)
