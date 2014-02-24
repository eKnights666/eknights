import urllib2
import json
import time

all_commits = urllib2.urlopen('https://api.github.com/repos/hasadna/Open-Knesset/commits')
all_commits = json.loads(all_commits.read())

urls = []

for commit in all_commits:
	urls.append(commit['url'])


all_commits = []

for url in urls:
	print 'Working on ' + url
	commits = urllib2.urlopen(url)
	commits = json.loads(commits.read())
	all_commits.append(commit)
	time.sleep(3)



with open('data.json', 'w') as outfile:
  json.dump(all_commits, outfile)
  
# print all_commits