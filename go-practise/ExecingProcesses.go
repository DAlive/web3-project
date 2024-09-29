package main

import (
	"os"
	"os/exec"
	"syscall"
)

func main() {
	binaries, lookErr := exec.LookPath("ls")
	if lookErr != nil {
		panic(lookErr)
	}

	args := []string{"ls", "-a", "-l", "-h"}

	env := os.Environ()

	execErr := syscall.Exec(binaries, args, env)
	if execErr != nil {
		panic(execErr)
	}
}
