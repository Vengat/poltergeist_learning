class Person

	@first_name
	@last_name

	def initialize(first_name, last_name)
		@first_name = first_name
		@last_name = last_name
    end

    def print_name
    	puts @special
    	puts @first_name + @last_name
    end

end

person = Person.new('Vengat', 'Ramanan')
person.print_name