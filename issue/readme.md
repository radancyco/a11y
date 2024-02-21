To set up a Google Sheet with a custom built form, check out this tutorial: 

https://github.com/levinunnink/html-form-to-google-sheet

or 

https://github.com/jamiewilson/form-to-google-sheets

To import to JIRA, go to Google sheet connected to form and go to "Download > Comma Seperated Values (CSV)"

Go to JIRA and select "Issues > Import Issues from CSV"

On first step, upload the CSV you downloaded and select "Use an existing configuration file" then upload jira-a11y-config.txt and hit "Next"

On second step, make sure "TB Client Development Dev Queue" is selected.

On third step, all CSV values should be mapped to fields in JIRA, but do not map the "Description" field or you will lose formatting (line breaks, etc.)

On forth step, you can validate and then import the tickets. 

Sit back and relax! 