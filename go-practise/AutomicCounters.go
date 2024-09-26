package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var ops atomic.Uint64
	ops.Store(50001)
	var wg sync.WaitGroup

	for i := 0; i < 50; i++ {
		wg.Add(1)

		go func() {
			for c := 0; c < 1000; c++ {
				ops.Add(^uint64(0))
			}
			wg.Done()
		}()
	}
	wg.Wait()
	fmt.Println("ops: ", ops.Load())
}
