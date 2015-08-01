module PubViaComLocator

	show_link = "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span[#{showNumber}]"
	#@link_text = @show_link + "/div[1]/a"
	link_text = "//div[@class='ms-webpart-chrome ms-webpart-chrome-fullWidth ']/div[@class='ms-WPBody ']/div[@class='ms-rtestate-field']/div[@id='homenavigation']/span[#{showNumber}]/div[1]/a"
	@number_of_rows_of_images = "//div[@id='dvImages']/div[2]/table/tr"
	@number_of_images_of_row = "//div[@id='dvImages']/div[2]/table/tr[#{row_number}]/td"
	@image = "//div[@id='dvImages']/div[2]/table/tr[#{row_number}]/td[#{column_number}]/table/tbody/table/tr[1]/td/a/img"
	@image_text = "//div[@id='dvImages']/div[2]/table/tr[#{row_number}]/td[#{column_number}]/table/tbody/table/tr[2]/td/span/a"

end