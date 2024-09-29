package main

import (
	"bufio"
	"fmt"
	"net/http"
)

func main() {
	resp, err := http.Get("https://gobyexample.com")
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	fmt.Println("Response status:", resp.Status)

	scanners := bufio.NewScanner(resp.Body)
	for i := 0; scanners.Scan() && i < 5; i++ {
		fmt.Println(scanners.Text())
	}
	if err := scanners.Err(); err != nil {
		panic(err)
	}
}
