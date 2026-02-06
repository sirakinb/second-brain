#!/usr/bin/env python3
from agentmail import AgentMail
from datetime import datetime, timedelta
import pytz

# Initialize AgentMail
api_key = "am_f85356eab47ebae5877d9f134e05864f8976e939662a321272db03a85510aa3c"
client = AgentMail(api_key=api_key)

# Example: Schedule meeting for tomorrow at 2 PM EST
eastern = pytz.timezone('America/New_York')
start_time = datetime.now(eastern) + timedelta(days=1)
start_time = start_time.replace(hour=14, minute=0, second=0, microsecond=0)
end_time = start_time + timedelta(hours=1)

# Format for iCalendar (.ics)
ical_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AgentMail//EN
BEGIN:VEVENT
UID:{start_time.strftime('%Y%m%d%H%M%S')}@agentmail.to
DTSTAMP:{datetime.now(pytz.UTC).strftime('%Y%m%dT%H%M%SZ')}
DTSTART:{start_time.strftime('%Y%m%dT%H%M%S')}
DTEND:{end_time.strftime('%Y%m%dT%H%M%S')}
SUMMARY:Coffee Chat
DESCRIPTION:Let's catch up!
LOCATION:Starbucks Downtown
ORGANIZER:mailto:agentadzo@agentmail.to
ATTENDEE:mailto:aki.b@pentridgemedia.com
ATTENDEE:mailto:friend@example.com
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR"""

# Send calendar invite
email_body = f"""Hi!

You're invited to:
📅 Coffee Chat
🕐 {start_time.strftime('%B %d, %Y at %I:%M %p %Z')}
📍 Starbucks Downtown

See attached calendar invite. Just open it to add to your calendar!

— Adzo
"""

print("Sending calendar invite...")
# Note: AgentMail API needs attachment support
# This is a simplified example - actual implementation may vary

print(f"Calendar event: {start_time.strftime('%B %d at %I:%M %p')}")
print(f"Attendees: aki.b@pentridgemedia.com, friend@example.com")
print("\nTo send with attachment, you'd use:")
print("client.inboxes.messages.send(..., attachments=[{'filename': 'invite.ics', 'content': ical_content}])")
