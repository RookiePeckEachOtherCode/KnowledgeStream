package utils

import (
	"unicode/utf8"
)

var ac *ACAutomaton

// AC自动机节点结构
type TrieNode struct {
	children map[rune]*TrieNode // 子节点映射
	fail     *TrieNode          // 失败指针
	isEnd    bool               // 是否为敏感词结尾
	wordLen  int                // 敏感词长度（用于快速替换）
}

// 创建新节点
func NewTrieNode() *TrieNode {
	return &TrieNode{
		children: make(map[rune]*TrieNode),
	}
}

// AC自动机结构
type ACAutomaton struct {
	root *TrieNode // 根节点
}

// 创建AC自动机
func NewACAutomaton() *ACAutomaton {
	return &ACAutomaton{
		root: NewTrieNode(),
	}
}

// 插入敏感词
func (ac *ACAutomaton) Insert(word string) {
	node := ac.root
	for _, c := range word {
		if _, ok := node.children[c]; !ok {
			node.children[c] = NewTrieNode()
		}
		node = node.children[c]
	}
	node.isEnd = true
	node.wordLen = utf8.RuneCountInString(word)
}

// 构建失败指针
func (ac *ACAutomaton) Build() {
	queue := make([]*TrieNode, 0)

	// 第一层节点失败指针指向root
	for _, child := range ac.root.children {
		child.fail = ac.root
		queue = append(queue, child)
	}

	// 广度优先搜索构建失败指针
	for len(queue) > 0 {
		parent := queue[0]
		queue = queue[1:]

		for char, child := range parent.children {
			// 临时失败指针
			failNode := parent.fail

			// 沿着失败指针向上查找
			for failNode != nil {
				if temp, ok := failNode.children[char]; ok {
					child.fail = temp
					break
				}
				failNode = failNode.fail
			}

			// 没找到则指向root
			if failNode == nil {
				child.fail = ac.root
			}

			queue = append(queue, child)
		}
	}
}

// 过滤敏感词（修正版）
func (ac *ACAutomaton) Filter(text string) string {
	textRunes := []rune(text)
	current := ac.root
	replaceMap := make(map[int]int)

	for i := 0; i < len(textRunes); i++ {
		char := textRunes[i]

		for current != ac.root && current.children[char] == nil {
			current = current.fail
		}

		if next, ok := current.children[char]; ok {
			current = next
		} else {
			continue
		}

		// 关键修改：遍历所有可能的失败路径
		temp := current
		for temp != ac.root {
			if temp.isEnd {
				start := i - temp.wordLen + 1
				if start < 0 {
					start = 0
				}
				end := i
				if end >= len(textRunes) {
					end = len(textRunes) - 1
				}
				for j := start; j <= end; j++ {
					replaceMap[j] = 1
				}
			}
			temp = temp.fail
		}
	}

	result := make([]rune, 0, len(textRunes))
	for i, r := range textRunes {
		if _, ok := replaceMap[i]; ok {
			result = append(result, '*')
		} else {
			result = append(result, r)
		}
	}
	return string(result)
}
func init() {
	ac = NewACAutomaton()
	// 插入敏感词
	badWords := []string{
		"垃圾",
		"脑残",
		"中国",
		"fuck",
		"傻逼",
		"草泥马",
		"弱智",
		"尼玛",
		"死",
		"日",
		"草",
		"有病",
		"废物",
		"操",
		"妈",
	}

	for _, word := range badWords {
		ac.Insert(word)
	}

	// 构建AC自动机
	ac.Build()
}
func CommentByFilter(text string) string {
	output := ac.Filter(text)
	return output
}
