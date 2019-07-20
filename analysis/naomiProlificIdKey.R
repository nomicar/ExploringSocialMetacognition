# Produce a data frame of prolific IDs and prolific ID hashes

library(digest)

# rawString should contain a copy-paste from the prolific website study page
if(exists('rawString')) {
  prolificIds <- NULL
  matches <- gregexpr('5[a-z0-9]{23}', rawString)
  for(x in matches[[1]])
    prolificIds <- c(prolificIds, substr(rawString, x, x+23))
} else
  stop("No rawString to read prolific IDs from")

prolificIdHashes <- sapply(prolificIds,digest,algo='sha1',serialize=F)

key = data.frame(id = prolificIds, hash = prolificIdHashes)
rownames(key) <- NULL

write.csv(key, "prolific-id-key.csv")

# Use these to produce a file you can copy-paste into Prolific's More > Bonus Payments field
# Should look like
#
# prolificid, somevaluein£
#