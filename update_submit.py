import re

with open("src/app/book/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

submit_orig = """  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceDetails = calculateQuote();"""

submit_new = """  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const priceDetails = calculateQuote();"""
content = content.replace(submit_orig, submit_new)

push_orig = """    localStorage.setItem("showBookingNotification", "true");
    router.push("/profile");
  };"""

push_new = """    localStorage.setItem("showBookingNotification", "true");
    
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } catch (error) {
      console.error('Email failed to send', error);
    }
    
    setIsLoading(false);
    router.push("/profile");
  };"""
content = content.replace(push_orig, push_new)

with open("src/app/book/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("submitDetails updated for nodemailer API.")
