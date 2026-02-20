# 🚀 Quick Start - Deploy to getnova.ca

## TL;DR - Get Live in 30 Minutes

### Step 1: Push to GitHub (5 min)
```bash
cd /path/to/nova-studio
git init
git add .
git commit -m "Nova Studio ready for deployment"
git remote add origin https://github.com/Rahul-Sarin/nova-studio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Netlify (10 min)
1. Go to https://netlify.com and log in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select GitHub → Choose "nova-studio" repository
4. Leave build settings empty, publish directory: `.`
5. Click "Deploy site"
6. Wait ~2 minutes for deployment

### Step 3: Test Temporary URL (2 min)
1. Click the temporary URL (e.g., `random-name.netlify.app`)
2. Test the contact form
3. Verify you receive email at contact@getnova.ca

### Step 4: Configure Form Notifications (3 min)
1. Site settings → Forms
2. Form notifications → Add notification
3. Email notification → contact@getnova.ca
4. Save

### Step 5: Add Custom Domain (10 min + DNS wait)
1. Domain settings → Add custom domain
2. Enter: `getnova.ca`
3. Copy the 4 Netlify nameservers shown
4. Go to your domain registrar (where you bought getnova.ca)
5. Update nameservers with the 4 Netlify nameservers
6. Save and wait 24-48 hours for DNS propagation

### Step 6: Done! ✅
- Site will be live at https://getnova.ca (after DNS propagation)
- Form submissions email to contact@getnova.ca
- HTTPS/SSL automatically enabled
- Every GitHub push auto-deploys

---

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Site deployed on Netlify
- [ ] Form tested and working
- [ ] Email notifications configured
- [ ] Custom domain added
- [ ] Nameservers updated at registrar
- [ ] Waiting for DNS propagation (24-48 hrs)
- [ ] SSL certificate provisioned (automatic after DNS)

---

## 📚 Need More Details?

**Full Guide:** [NETLIFY_DEPLOYMENT_GUIDE.md](NETLIFY_DEPLOYMENT_GUIDE.md)  
**Overview:** [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)  
**Site Info:** [README.md](README.md)

---

## ⚡ Command Reference

### Git Commands
```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Rahul-Sarin/nova-studio.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Update description"
git push
```

### Verify Deployment
```bash
# Check DNS propagation
curl -I https://getnova.ca

# Test form endpoint
curl https://getnova.ca/contact.html
```

---

## 🔗 Important URLs

**GitHub Repo:**  
https://github.com/Rahul-Sarin/nova-studio

**Netlify Dashboard:**  
https://app.netlify.com/sites/nova-studio

**Live Site (after DNS):**  
https://getnova.ca

**Check DNS Propagation:**  
https://dnschecker.org (enter: getnova.ca)

---

## 📞 Your Contact Info

**Email:** contact@getnova.ca  
**Phone:** +1 (905) 744-4242  
**Domain:** getnova.ca  
**GitHub:** Rahul-Sarin

---

## 🎉 That's It!

Simple, fast, and free. Your professional website will be live at https://getnova.ca in 1-2 days (after DNS propagation).

**Any issues?** Check the troubleshooting section in [NETLIFY_DEPLOYMENT_GUIDE.md](NETLIFY_DEPLOYMENT_GUIDE.md)
