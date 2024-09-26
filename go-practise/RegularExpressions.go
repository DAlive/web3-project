package main

import (
	"bytes"
	"fmt"
	"regexp"
)

func main() {
	match, _ := regexp.MatchString("p([a-z]+)ch", "peach")
	fmt.Println(match)

	r, _ := regexp.Compile("p([a-z]+)ch")
	fmt.Println(r.MatchString("peach"))

	//返回第一个匹配的字符串 peach
	fmt.Println(r.FindString("peach punch"))
	//返回第一个匹配字符串的开始和结束索引 [0 5] 不包含结尾
	fmt.Println("idx:", r.FindStringIndex("peach punch"))
	//返回匹配整个子串和子表达式的开始和结束索引 [0 5 1 4]
	//主匹配随你范围[0 5]， 括号中的子匹配(即[a-z]+ 匹配的eac)范围是[1 4]
	fmt.Println(r.FindStringSubmatchIndex("peach punch"))
	//查找所有匹配的子串并返回一个切片，返回["peach“ ”punch“ ”pinch"]
	fmt.Println(r.FindAllString("peach punch pinch", -1))
	//[[0 5 1 3], [6 11 7 9] [12 17 13 15]]
	fmt.Println("all:", r.FindAllStringSubmatchIndex("peach punch pinch", -1))
	//返回前两个匹配 peach punch
	fmt.Println(r.FindAllString("peach punch pingch", 2))
	//true
	fmt.Println(r.Match([]byte("peach")))

	r = regexp.MustCompile("p([a-z]+)ch")
	fmt.Println("regexp: ", r)
	//将匹配到的字符串替换为<fruit>
	fmt.Println(r.ReplaceAllString("a peach", "<fruit>"))

	in := []byte("a peach")
	out := r.ReplaceAllFunc(in, bytes.ToUpper)
	fmt.Println(string(out))
}
