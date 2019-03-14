setwd("C:/xampp/htdocs/ExploringSocialMetacognition/analysis")
source('src/ESM_core.R')

print('Load data')
folderName <- "C:/xampp/htdocs/ExploringSocialMetacognition/AdvisorChoice/data/processed"
files <- list.files(folderName)
participants <- NULL
trials <- NULL
advisors <- NULL
questionnaires <- NULL
genTrustQ <- NULL
for (i in seq(length(files))) {
  fileName <- paste(folderName, files[[i]], sep='/')
  json <- readChar(fileName, file.info(fileName)$size)
  jsonData <- fromJSON(json, simplifyVector = T, simplifyMatrix = T, simplifyDataFrame = T)
  # store all columns in participants table except the three last 
  # (trials, advisors, and questionnaires are stored separately)
  participants <- rbind(participants, 
                        as.data.frame(t(jsonData[!names(jsonData) %in% c('advisors', 
                                                                         'questionnaires', 
                                                                         'trials')])))
  # store the trials in the trials table
  trials <- rbind(trials, jsonData$trials)
  advisors <- rbind(advisors, jsonData$advisors)
}

trials$finalCorrect <- trials$finalAnswer == trials$correctAnswer
aggregate(finalCorrect ~ participantId, data = trials, FUN = mean)

aggregate(resawStimulus ~ participantId, data = trials, FUN = mean)

install.packages("openxlsx")

library(openxlsx)
write.xlsx(trials, "trials.xlsx")
write.xlsx(participants, "participants.xlsx")
write.xlsx(advisors, "advisors.xlsx")