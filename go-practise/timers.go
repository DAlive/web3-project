package main

import (
	"fmt"
	"time"
)

func main() {
	timer1 := time.NewTimer(2 * time.Second)

	<-timer1.C
	fmt.Println("Timer1 fired")

	timer2 := time.NewTimer(time.Second)
	go func() {
		<-timer2.C
		fmt.Println("Timer2 fired")
	}()
	time.Sleep(2 * time.Second)
	//定时器一旦被触发之后就不能被停止，所以此处不能stop
	stop2 := timer2.Stop()
	if stop2 {
		fmt.Println("Timer2 stopped")
	}

	time.Sleep(2 * time.Second)

}
