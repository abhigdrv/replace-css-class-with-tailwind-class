while read line
do
  hashClass=`echo $line | awk 'BEGIN {FS=" ### ";}{print $1}'`
  twClass=`echo $line | awk 'BEGIN {FS=" ### ";}{print $2}'`
  sed -i "s@$hashClass@$twClass@g" fileToConvert.html
done <classMapper.txt