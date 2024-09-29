package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	scanners := bufio.NewScanner(os.Stdin)

	for scanners.Scan() {
		ucl := strings.ToUpper(scanners.Text())
		fmt.Println(ucl)
	}

	if err := scanners.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "error: ", err)
		os.Exit(1)
	}
}
