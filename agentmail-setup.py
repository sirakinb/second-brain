#!/usr/bin/env python3
from agentmail import AgentMail

# Initialize the client
api_key = "am_f85356eab47ebae5877d9f134e05864f8976e939662a321272db03a85510aa3c"
client = AgentMail(api_key=api_key)

# Create an inbox
print("Creating inbox...")
inbox = client.inboxes.create()
print("\n✅ Inbox created successfully!")
print("\nInbox details:")
print(inbox)
print(f"\n📧 You can now send emails to this inbox address")
