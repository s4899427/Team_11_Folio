from playwright.sync_api import sync_playwright
B="http://localhost:4174/#"
ok=True
def check(n,c,d=""):
    global ok; ok=ok and bool(c); print(("PASS " if c else "FAIL ")+n+(" "+str(d) if not c else ""))
with sync_playwright() as pw:
    b=pw.chromium.launch(); ctx=b.new_context(viewport={"width":390,"height":844}); p=ctx.new_page()
    reqs=[]; p.on("request",lambda r:reqs.append(r.url))
    p.goto(B+"/demo"); p.wait_for_timeout(500)
    check("sandbox page", p.get_by_test_id("sandbox").count()==1)
    p.get_by_test_id("sandbox-start").click(); p.wait_for_timeout(1500)
    check("lands on welcome", "welcome" in p.url, p.url)
    for _ in range(8):
        if "welcome" not in p.url: break
        if p.get_by_test_id("welcome-next").is_disabled(): p.get_by_test_id("pick-brisbane").click()
        p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(300)
    p.wait_for_timeout(800)
    check("Today shows demo-mode banner (local data)", "Demo mode" in p.inner_text("body"))
    p.goto(B+"/register"); p.fill('[aria-label="Your name"]',"Marker"); p.fill('[aria-label="Email"]',"m@x.com"); p.fill('[aria-label="Password"]',"secret123"); p.get_by_role("button",name="Create account").click(); p.wait_for_timeout(700)
    p.goto(B+"/me?tab=settings"); p.wait_for_timeout(400)
    check("demo switches visible in sandbox", p.get_by_test_id("demo-admin").count()==1)
    p.get_by_test_id("demo-admin").click(); p.wait_for_timeout(300)
    check("Team tab opens Team screen", (p.get_by_test_id("tab-team").click() or True) and p.get_by_test_id("admin-page").count()==1)
    check("no requests to the shared database", not any("example.invalid" in r for r in reqs), [r for r in reqs if "invalid" in r][:3])
    p.goto(B+"/me?tab=settings"); p.get_by_test_id("leave-sandbox").click(); p.wait_for_timeout(1500)
    check("leaving returns to live mode (welcome again)", "welcome" in p.url, p.url)
    b.close()
print("ALL OK" if ok else "FAILURES")
