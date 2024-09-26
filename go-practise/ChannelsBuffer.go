package main

import "fmt"

func main() {
	messages := make(chan string, 2)

	messages <- "buffered"
	messages <- "channel"

	var receiveMessages []string
	for i := 0; i < 2; i++ {
		receiveMessages = append(receiveMessages, <-messages)
	}
	fmt.Println(receiveMessages)
	// fmt.Println(<-messages)
	// fmt.Println(<-messages)
}
