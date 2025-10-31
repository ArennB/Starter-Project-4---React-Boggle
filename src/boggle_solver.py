# Arenn Banks
# SID: @03102572

import re


class Node:
    """Trie node representing a single character."""
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False


class Trie:
    """Trie (prefix tree) data structure for fast word/prefix lookups."""
    def __init__(self):
        self.root = Node()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = Node()
            current = current.children[char]
        current.is_end_of_word = True

    def search(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                return False
            current = current.children[char]
        return current.is_end_of_word

    def startsWith(self, prefix):
        current = self.root
        for char in prefix:
            if char not in current.children:
                return False
            current = current.children[char]
        return True


class Boggle:
    """
    Boggle solver class.

    Attributes:
        grid (list[list[str]]):
        NxN grid of letters or multi-letter tiles
        (e.g., 'Qu', 'St').
        dictionary (list[str]): List of valid words.
        solutions (list[str]): List of valid words found in the grid.

    Methods:
        getSolution():
        Finds all valid words in the grid using a Trie and recursive DFS.

    Approach:
        1. Validate input and grid format.
        2. Convert all letters to lowercase for consistency.
        3. Build a Trie from the dictionary for fast prefix and word lookups.
        4. For each cell in the grid,
        perform a depth-first search exploring all adjacent
           tiles recursively, building words along the way.
        5. Add words that exist in the dictionary
        and are >= 3 letters to the solution set.
    """
    def __init__(self, grid, dictionary):
        self.grid = grid
        self.dictionary = dictionary
        self.solutions = []

    def getSolution(self):
        if self.grid is None or self.dictionary is None:
            return self.solutions

        grid_size = len(self.grid)
        for row in self.grid:
            if len(row) != grid_size:
                return self.solutions

        self.convert_to_lower()

        if not self.is_grid_valid():
            return self.solutions

        solution_set = set()
        trie = Trie()
        for word in self.dictionary:
            trie.insert(word)

        for x in range(grid_size):
            for y in range(grid_size):
                visited = [
                  [False for _ in range(grid_size)] for _ in range(grid_size)
                  ]
                self.find_words("", x, y, visited, trie, solution_set)

        self.solutions = list(solution_set)
        return self.solutions

    def find_words(self, current_word, x, y, visited, trie, solution_set):
        grid_size = len(self.grid)
        if x < 0 or y < 0 or x >= grid_size or y >= grid_size or visited[x][y]:
            return

        current_word += self.grid[x][y].lower()
        if not trie.startsWith(current_word):
            return

        visited[x][y] = True
        if trie.search(current_word) and len(current_word) >= 3:
            solution_set.add(current_word)

        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx != 0 or dy != 0:
                    self.find_words(
                      current_word, x + dx, y + dy, visited, trie, solution_set
                      )

        visited[x][y] = False

    def convert_to_lower(self):
        # Make a lowercase copy of the grid
        self.grid = [[cell.lower() for cell in row] for row in self.grid]

        # Make a lowercase copy of the dictionary
        self.dictionary = [word.lower() for word in self.dictionary]

    def is_grid_valid(self):
        regex = r'^(qu|st|ie|[a-hj-pr-z])$'
        for row in self.grid:
            for cell in row:
                if not re.match(regex, cell.lower()):
                    return False
        return True


# --- Example usage ---
def main():
    grid = [
        ["T", "W", "Y", "R"],
        ["E", "N", "P", "H"],
        ["G", "St", "Qu", "R"],
        ["O", "N", "T", "A"],
    ]
    dictionary = [
        "art", "ego", "gent", "get", "net",
        "new", "newt", "prat", "pry", "qua",
        "quart", "quartz", "rat", "tar", "tarp",
        "ten", "went", "wet", "arty", "not", "quar"
    ]

    game = Boggle(grid, dictionary)
    print(sorted(game.getSolution()))


if __name__ == "__main__":
    main()