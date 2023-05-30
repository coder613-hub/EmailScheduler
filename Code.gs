// Card 1: Homepage Card
function onHomepageTrigger() {
  var card = CardService.newCardBuilder();

  var recipientSection = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setTitle('Recipient Email')
      .setHint('Enter the recipient email address')
      .setFieldName('recipientemail'));
  card.addSection(recipientSection);

  var subjectSection = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setTitle('Subject Line')
      .setHint('Enter the subject line')
      .setFieldName('subjectline'));
  card.addSection(subjectSection);

  var bodySection = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setTitle('Body of Email')
      .setMultiline(true)
      .setHint('Enter the body of the email')
      .setFieldName('emailbody'));
  card.addSection(bodySection);

  var frequencySection = CardService.newCardSection()
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle('Frequency')
      .setFieldName('frequency')
      .addItem('Daily', 'daily', false)
      .addItem('Weekly', 'weekly', false)
      .addItem('Monthly', 'monthly', false));
  card.addSection(frequencySection);

  var submitAction = CardService.newAction()
    .setFunctionName('navigateToNextCard');
  var submitButton = CardService.newTextButton()
    .setText('Next')
    .setOnClickAction(submitAction);
  var buttonSection = CardService.newCardSection()
    .addWidget(submitButton);
  card.addSection(buttonSection);

  return card.build();
}

// Card 2: Frequency Selection Card
function navigateToNextCard(event) {
  var frequency = event.formInput['frequency'];
  var card;

  if (frequency === 'daily') {
    card = createDailyCard(event);
  } else if (frequency === 'weekly') {
    card = createWeeklyCard(event);
  } else if (frequency === 'monthly') {
    card = createMonthlyCard(event);
  }

  var navigation = CardService.newNavigation().pushCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation)
    .build();

  return actionResponse;
}

// Create Daily Card
function createDailyCard(event) {
  var card = CardService.newCardBuilder();

  var timeInput = CardService.newTextInput()
    .setTitle('Time of Day')
    .setHint('Enter a time (e.g., 10:00 AM)')
    .setFieldName('time');

  var submitAction = CardService.newAction()
    .setFunctionName('submitFormData');
  var submitButton = CardService.newTextButton()
    .setText('Submit')
    .setOnClickAction(submitAction);
  var buttonSection = CardService.newCardSection()
    .addWidget(submitButton);
  card.addSection(CardService.newCardSection().addWidget(timeInput))
    .addSection(buttonSection);

  // Store the form inputs in the user properties
  PropertiesService.getUserProperties().setProperty('formInputs', JSON.stringify(event.formInput));

  return card.build();
}

// Create Weekly Card
function createWeeklyCard(event) {
  var card = CardService.newCardBuilder();

  var dayInput = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle('Day of the Week')
    .setFieldName('day')
    .addItem('Sunday', '1', false)
    .addItem('Monday', '2', false)
    .addItem('Tuesday', '3', false)
    .addItem('Wednesday', '4', false)
    .addItem('Thursday', '5', false)
    .addItem('Friday', '6', false)
    .addItem('Saturday', '7', false);

  var timeInput = CardService.newTextInput()
    .setTitle('Time of Day')
    .setHint('Enter a time (e.g., 10:00 AM)')
    .setFieldName('time');

  var submitAction = CardService.newAction()
    .setFunctionName('submitFormData');
  var submitButton = CardService.newTextButton()
    .setText('Submit')
    .setOnClickAction(submitAction);
  var buttonSection = CardService.newCardSection()
    .addWidget(submitButton);
  card.addSection(CardService.newCardSection().addWidget(dayInput))
    .addSection(CardService.newCardSection().addWidget(timeInput))
    .addSection(buttonSection);

  // Store the form inputs in the user properties
  PropertiesService.getUserProperties().setProperty('formInputs', JSON.stringify(event.formInput));

  return card.build();
}

// Create Monthly Card
function createMonthlyCard(event) {
  var card = CardService.newCardBuilder();

  var dayInput = CardService.newTextInput()
    .setTitle('Day of the Month')
    .setHint('Enter a day (e.g., 15)')
    .setFieldName('day');

  var timeInput = CardService.newTextInput()
    .setTitle('Time of Day')
    .setHint('Enter a time (e.g., 10:00 AM)')
    .setFieldName('time');

  var submitAction = CardService.newAction()
    .setFunctionName('submitFormData');
  var submitButton = CardService.newTextButton()
    .setText('Submit')
    .setOnClickAction(submitAction);
  var buttonSection = CardService.newCardSection()
    .addWidget(submitButton);
  card.addSection(CardService.newCardSection().addWidget(dayInput))
    .addSection(CardService.newCardSection().addWidget(timeInput))
    .addSection(buttonSection);

  // Store the form inputs in the user properties
  PropertiesService.getUserProperties().setProperty('formInputs', JSON.stringify(event.formInput));

  return card.build();
}

// Submit Form Data
function submitFormData(event) {
  var senderEmail = Session.getActiveUser().getEmail();
  var formInputs = JSON.parse(PropertiesService.getUserProperties().getProperty('formInputs'));

  // Access the stored form inputs
  var recipientEmail = formInputs['recipientemail'];
  var subjectLine = formInputs['subjectline'];
  var emailBody = formInputs['emailbody'];
  var frequency = formInputs['frequency'];
  var numfrequency;
  //var day;
  
  if(frequency === 'monthly') {
  numfrequency = 1; 
  } else if (frequency === 'weekly') {
    numfrequency = 2;
  } else {
  numfrequency = 3;
  }
  
  var intday;
  if (numfrequency === 3) {
    intday = 0;
  } else {
    intday = parseInt(event.formInputs['day']);
  }

  var time = event.formInputs['time'];  
  var dateObj = new Date('2023-05-29 ' + time);
  var formattedDatetime = Utilities.formatDate(dateObj, 'GMT', 'yyyy-MM-dd HH:mm:ss');
  var timePortion = formattedDatetime.split(' ')[1];
  var desiredDatetime = '1998-01-23 ' + timePortion;
  
  // Clear the stored form inputs
  PropertiesService.getUserProperties().deleteProperty('formInputs');

  callAPI(senderEmail, recipientEmail, subjectLine, emailBody, formattedDatetime, numfrequency, intday);

  return CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(CardService.newTextParagraph().setText('Form submitted successfully.')))
    .build();
}

function callAPI(Sender, Recipient, Subject, Body, TimeOfDay, Recurring, NumberDay) {
  // Create the payload for your API call
  var payload = {
    "Sender": Sender,
    "Recipient": Recipient,
    "Subject": Subject,
    "Body": Body,
    "TimeOfDay": TimeOfDay,
    "Recurring": Recurring,
    "NumberDay": NumberDay
  };

  // Log the payload
  console.log("API Gateway Call - Payload:", payload);

  // Make a POST request to your API endpoint
  var url = "https://xdk1nsl4ba.execute-api.us-east-1.amazonaws.com/dev/";
  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  // Log the request URL and options
  console.log("API Gateway Call - URL:", url);
  console.log("API Gateway Call - Options:", options);

  var response = UrlFetchApp.fetch(url, options);

  // Handle the response from the API
  if (response.getResponseCode() === 200) {
    // Log successful response
    console.log("API Gateway Call - Success");
    console.log("API Gateway Call - Response:", response.getContentText());
  } else {
    // Log failed response
    console.log("API Gateway Call - Failed. Error:", response);
  }
}
