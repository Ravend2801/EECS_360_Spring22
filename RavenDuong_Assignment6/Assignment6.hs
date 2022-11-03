main = undefined

--replicate function produces a list of of a specific number of identical elements using recursion 
replicates :: Int -> a -> [a]
replicates 0 y = [ ]
replicates x y = y : replicates (x-1) y

--factors functions check all number smaller than the given number (n), and returns a list of the factors of n
factors :: Int -> [Int]
factors n = [x | x <- [1..n-1], n `mod` x == 0]

--perfect function returns the list of all perfect numbers up to a given limit by calculating the sum of the factors
perfects :: Int -> [Int]
perfects n = [x|x<-[1..n],sum(factors x)==x]

--find function returns a list of all values which is the same as the given key, from a list of key-value pairs.
find :: Eq a => a -> [(a,b)] -> [b]
find k t = [v| (k',v) <-t, k==k']

--position function returns the list of all positions that the value can be found in a list by pairing each element with its position, then selecting and adding that position number to the list
positions :: Int -> [Int] -> [Int]
positions x xs = find x (zip xs [0..])

--scalarproduct function returns the scalar product of two lists
--multiply the values at the same position of each list and sum all result together
scalarproduct :: [Int] -> [Int] -> Int
scalarproduct xs ys = sum [x * y | (x,y) <- zip xs ys]