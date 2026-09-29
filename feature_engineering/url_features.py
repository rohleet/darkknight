import math
import re
from collections import Counter
from urllib.parse import urlparse, parse_qs
import ipaddress
import tldextract

import pandas  as pd

SUSPICIOUS_TLDS = {
    "tk", "ml", "ga", "cf", "gq",
    "top", "xyz", "click", "work",
    "zip", "mov", "country", "stream",
    "icu", "py", "cyou", "date",
    "download", "faith", "info", "ke",
    "loan", "men", "porn", "sex",
    "pw", "quest", "rest", "review",
    "sbs", "support", "win", "am",
    "bd", "best", "bid", "cd", "cfd",
    "xn--2scrj9c", "xn--5tzm5g", "xn--6frz82g",
    "xn--czrs0t", "xn--fjq720a", "xn--s9brj9c",
    "xn--unup4y", "xn--vhquv", "xn--xhq521b"
}

SUSPICIOUS_KEYWORDS = {
    # --- Original Base Keywords ---
    "login", "logon", "signin", "sign-in", "verify", "verification", 
    "account", "password", "passwd", "credential", "secure", "security", 
    "update", "confirm", "confirmation", "bank", "banking", "payment", 
    "billing", "wallet", "recover", "unlock", "authorize", "authentication",

    # --- Urgent Account & Security Alerts ---
    "alert", "warning", "notice", "notify", "notification", "urgent",
    "critical", "suspended", "disabled", "locked", "expire", "expired",
    "activity", "device", "attempt", "unauthorized", "block", "blocked",
    "restore", "reactivate", "validate", "validation", "review",

    # --- Financial, Invoice & E-commerce Scams ---
    "invoice", "receipt", "statement", "refund", "reimbursement", "dispute",
    "claim", "transfer", "wire", "remittance", "payout", "deposit", "card",
    "credit", "debit", "checkout", "purchase", "order", "shipping", "delivery",
    "tracking", "package", "parcel", "postal", "tax", "irs", "revenue",

    # --- Corporate Infrastructure & Remote Work (Phishing) ---
    "admin", "administrator", "portal", "webmail", "outlook", "exchange",
    "office365", "o365", "sharepoint", "onedrive", "anydesk", "teamviewer",
    "citrix", "vpn", "access", "dashboard", "helpdesk", "support", "service",
    "hr", "payroll", "benefits", "employee",

    # --- Shared Documents & Signatures ---
    "document", "doc", "file", "pdf", "excel", "sheet", "viewer", "download",
    "attachment", "docusign", "esign", "signature", "signnow", "adobe",

    # --- Crypto & Web3 Phishing ---
    "crypto", "bitcoin", "btc", "ethereum", "eth", "solana", "sol", "airdrop",
    "claim-airdrop", "mint", "nft", "metamask", "phantom", "ledger", "seedphrase",
    "blockchain", "swap", "staking",

    # --- Tech Support & General Fraud ---
    "gift", "reward", "bonus", "prize", "winner", "lottery", "survey",
    "free", "promo", "coupon", "enforcement", "legal", "police", "court"
}

def safe_ratio(numerator, denominator):
    if not denominator or denominator == 0:
        return 0.0
    return float(numerator) / float(denominator)

def entropy(value : str) -> float:
    if not value:
        return 0.0

    counts = Counter(value)
    length = len(value)

    return -sum(
        (count / length) * math.log2(count / length)
        for count in counts.values()
    )


def extract_url_features(url: str) -> dict:

    url = str(url).strip() #removal of starting and ending spaces

    try:
        parsed_url = urlparse(url)
        invalid_url = 0
    except ValueError:
        # URL is malformed, but we can still extract
        # lexical features from the raw URL.
        parsed_url = urlparse("")
        invalid_url = 1

    hostname = parsed_url.hostname or "" #for hostname
    protocol = parsed_url.scheme or "" #for protocol used
    net_loc = parsed_url.netloc or "" #for domain+subdomain+port
    path = parsed_url.path or "" #path to specific page
    fragment = parsed_url.fragment or "" #for the internal page anchor or subsection identifier
    query = parsed_url.query or "" #for parameters or instructions passed from clients
    username = parsed_url.username or "" #to check if attcker trying to directly login
    password = parsed_url.password or "" #to check if attcker trying to directly login

    #Basic derivations of url parts

    hostname_clean = hostname.rstrip(".") #to remove the trailing dot if present (Standard DNS rules allow URLs to end with an invisible dot (e.g., google.com.))
    hostname_parts = hostname_clean.split(".") if hostname_clean else [] #divide the entire url  into tld, domain and subdomains


    #tldextract parsing :

    extracted = tldextract.extract(hostname)
    domain = extracted.domain

    tld = extracted.suffix

    subdomains = (
        extracted.subdomain.split(".")
        if extracted.subdomain
        else []
    )

    #Basic lengths :

    url_length = len(url)
    hostname_length = len(hostname)
    domain_length = len(domain)
    tld_length = len(tld)
    path_length = len(path)
    query_length = len(query)
    fragment_length = len(fragment)

    #Basic counts :

    try:
        query_parameter_count = len(parse_qs(query))
    except Exception:
        query_parameter_count = 0 #much more to do


    subdomain_count = len(subdomains)
    
    digit_count= 0
    letter_count= 0
    special_char_count= 0
    dot_count= 0
    hyphen_count= 0
    underscore_count= 0
    slash_count= 0
    question_mark_count= 0
    equals_count= 0
    ampersand_count= 0
    percent_count= 0
    at_count= 0
    
    
    # Single pass loop over the entire URL string (if we count it otherwise using builtin function for each count we must loop thorugh one url many times and for a entire dataset the cost will be too high) 
    for char in url:
        if char.isdigit():
            digit_count += 1
        elif char.isalpha():
            letter_count += 1
        else:
            special_char_count += 1
            
        if char == '.':
            dot_count += 1
        elif char == '-':
            hyphen_count += 1
        elif char == '_':
            underscore_count += 1
        elif char == '/':
            slash_count += 1
        elif char == '?':
            question_mark_count += 1
        elif char == '=':
            equals_count += 1
        elif char == '&':
            ampersand_count += 1
        elif char == '%':
            percent_count += 1
        elif char == '@':
            at_count += 1

    path_depth = len([
        segment
        for segment in path.split("/")
        if segment
    ])

    #Ip adress inside url check : 

    try:
        ipaddress.IPv4Address(hostname)
        has_ip_address = 1
    except (ValueError, TypeError):
        has_ip_address = 0

    # Suspicious structural indicators :

    try:
        has_port = int(parsed_url.port is not None)
    except ValueError:
        has_port = 1

    has_at_symbol = int("@" in url)

    # after_scheme = re.sub(
    #     r"^[a-zA-Z][a-zA-Z0-9+.-]*://",
    #     "",
    #     url,
    #     count=1,
    # )

    has_double_slash_in_path = int("//" in path)

    has_url_encoding = int(
        bool(re.search(r"%[0-9a-fA-F]{2}", url))
    )

    has_punycode = int(
        "xn--" in hostname.lower()
    )

    has_unicode = int(
        any(ord(c) > 127 for c in url)
    )

    has_https = int(
        parsed_url.scheme.lower() == "https"
    )

    #Host Name Characteritstics :

    hostname_has_digits = int(
        any(c.isdigit() for c in hostname)
    )

    hostname_has_hyphen = int(
        "-" in hostname
    )

    path_has_digits = int(
        any(c.isdigit() for c in path)
    )

    path_has_special_chars = int(
        bool(re.search(r"[^a-zA-Z0-9/._~-]", path))
    )

    numeric_subdomain = int(
        any(
            subdomain.isdigit()
            for subdomain in subdomains
        )
    )

    #username and password
    has_username = int(bool(parsed_url.username))
    has_password = int(bool(parsed_url.password))

    # Domain features :

    subdomain_length = sum(
        len(x) for x in subdomains
    )

    hostname_entropy = entropy(hostname)

    domain_entropy = entropy(domain)

    subdomain_entropy = entropy(
        ".".join(subdomains)
    )

    suspicious_tld = int(
        tld in SUSPICIOUS_TLDS
    )

    # Suspicious keyword features :

    # 1. Define and initialize the target variables at the beginning
    url_lower = url.lower()

    # 1. Broad keyword count scan
    suspicious_keyword_count = sum(
        keyword in url_lower
        for keyword in SUSPICIOUS_KEYWORDS
    )

    # 2. Optimized, direct variable extraction (Safe, fast, and no locals)
    login_keyword = int(any(x in url_lower for x in ("login", "logon", "signin", "sign-in")))
    
    verify_keyword = int(any(x in url_lower for x in (
        "verify", "verification", "validate", "validation", "confirm", "confirmation"
    )))
    
    account_keyword = int(any(x in url_lower for x in ("account", "profile", "user")))
    
    security_keyword = int(any(x in url_lower for x in (
        "secure", "security", "authentication", "authorize", "authorization"
    )))
    
    payment_keyword = int(any(x in url_lower for x in (
        "payment", "pay", "billing", "invoice", "wallet", "checkout"
    )))
    
    password_keyword = int(any(x in url_lower for x in ("password", "passwd", "credential", "credentials")))
    
    banking_keyword = int(any(x in url_lower for x in ("bank", "banking", "card", "credit", "debit")))

    digit_ratio = safe_ratio(
        digit_count,
        url_length
    )

    letter_ratio = safe_ratio(
        letter_count,
        url_length
    )

    return {
        # Basic
        "url_length": url_length,
        "hostname_length": hostname_length,
        "path_length": path_length,
        "query_length": query_length,
        "fragment_length": fragment_length,
        "path_depth": path_depth,
        "subdomain_count": subdomain_count,
        "query_parameter_count": query_parameter_count,
        "invalid_url": invalid_url,


        # Characters
        "digit_count": digit_count,
        "digit_ratio": digit_ratio,
        "letter_count": letter_count,
        "letter_ratio": letter_ratio,
        "special_char_count": special_char_count,
        "dot_count": dot_count,
        "hyphen_count": hyphen_count,
        "underscore_count": underscore_count,
        "slash_count": slash_count,
        "question_mark_count": question_mark_count,
        "equals_count": equals_count,
        "ampersand_count": ampersand_count,
        "percent_count": percent_count,
        "at_count": at_count,

        # Suspicious structure
        "has_ip_address": has_ip_address,
        "has_port": has_port,
        "has_at_symbol": has_at_symbol,
        "has_double_slash_in_path": has_double_slash_in_path,
        "has_url_encoding": has_url_encoding,
        "has_punycode": has_punycode,
        "has_unicode": has_unicode,
        "has_https": has_https,

        # Hostname
        "hostname_has_digits": hostname_has_digits,
        "hostname_has_hyphen": hostname_has_hyphen,
        "path_has_digits": path_has_digits,
        "path_has_special_chars": path_has_special_chars,

        # Domain
        "domain_length": domain_length,
        "tld_length": tld_length,
        "subdomain_length": subdomain_length,
        "hostname_entropy": hostname_entropy,
        "domain_entropy": domain_entropy,
        "subdomain_entropy": subdomain_entropy,
        "numeric_subdomain": numeric_subdomain,
        "suspicious_tld": suspicious_tld,

        # Keywords
        "suspicious_keyword_count": suspicious_keyword_count,
        "login_keyword": login_keyword,
        "verify_keyword": verify_keyword,
        "account_keyword": account_keyword,
        "security_keyword": security_keyword,
        "payment_keyword": payment_keyword,
        "password_keyword": password_keyword,
        "banking_keyword": banking_keyword,
        "has_username": has_username,
        "has_password": has_password,
    }


def main():

    # Load original dataset
    df = pd.read_csv("../dataset/url_dataset.csv")

    # Make sure required columns exist
    if "url" not in df.columns:
        raise ValueError("Dataset does not contain 'url' column")

    if "type" not in df.columns:
        raise ValueError("Dataset does not contain 'type' column")

    print(f"Loaded {len(df)} URLs")

    # Extract features
    feature_records = df["url"].map(extract_url_features).tolist()
    feature_df = pd.DataFrame.from_records(
        feature_records,
        index=df.index
    )

    # Keep original URL first,
    # engineered features in the middle,
    # type/label last


    engineered_df = pd.concat(
        [
            df[["url"]],
            feature_df,
            df[["type"]]
        ],
        axis=1
    )

    OUTPUT_FILE = "../dataset/engineered_dataset.csv"

    # Save
    engineered_df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print(
        f"Saved {len(engineered_df)} rows "
        f"and {len(engineered_df.columns)} columns "
        f"to {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()






    





     






