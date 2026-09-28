import math
import re
from urllib.parse import urlparse, parse_qs
import ipaddress

import pandas  as pd

def extract_url_features(url: str) -> dict:

    url = str(url).strip() #removal of starting and ending spaces

    parsed_url = urlparse(url)

    hostname = parsed_url.hostname or "" #for hostname
    protocol = parsed_url.scheme or "" #for protocol used
    net_loc = parsed_url.netloc or "" #for domain+subdomain+port
    path = parsed_url.path or "" #path to specific page
    fragment = parsed_url.fragment or "" #for the internal page anchor or subsection identifier
    query = parsed_url.fragment or "" #for parameters or instructions passed from clients
    port = parsed_url.port or "" #for port number specifically in integer format
    username = parsed_url.username or "" #to check if attcker trying to directly login
    pasword = parsed_url.password or "" #to check if attcker trying to directly login

    #Basic derivations of url parts

    hostname_clean = hostname.rstrip(".") #to remove the trailing dot if present (Standard DNS rules allow URLs to end with an invisible dot (e.g., google.com.))
    hostname_parts = hostname_clean.split(".") if hostname_clean else [] #divide the entire url  into tld, domain and subdomains

    domain = (
        hostname_parts[-2] 
        if hostname_parts
        else ""
    )

    tld = (
        hostname_parts[-1 ] 
        if hostname_parts
        else ""
    )

    subdomains = (
        hostname_parts[:-2]
        if hostname_parts 
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
    percent_count: 0
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

    

    





     






