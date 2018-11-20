cd ~/cutthroat-anagrams
node_modules/.bin/grunt jst
node_modules/.bin/grunt hashres
node_modules/.bin/webpack
git add .
git commit -m "default"
git push origin master &
exit 0
