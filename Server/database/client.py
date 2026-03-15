from supabase import create_client, Client # type: ignore

url = "https://aomwcmtegjtgrepugrsi.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbXdjbXRlZ2p0Z3JlcHVncnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjM4MDIsImV4cCI6MjA4ODk5OTgwMn0.7SzlhSQKvBGCE_XAWOLDUiDfcvKbPAVl4ReSHr2AyBQ"
supabase : Client = create_client(url, key)


