# Import packages for testing
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

chrome_options = Options()

# open the chrome in maximized mode
chrome_options.add_argument('--start-maximized')

driver = webdriver.Chrome('./chromedriver', chrome_options = chrome_options)
time.sleep(3)

# open the link to the webpage
driver.get('http://up829438.myvm.port.ac.uk/')

time.sleep(3)

# function to allow the script to continue on the google sign in pop up
main_window_handle = None
while not main_window_handle:
    main_window_handle = driver.current_window_handle
driver.find_element_by_xpath('//*[@id="signin"]/div/div/span').click()
signin_window_handle = None
while not signin_window_handle:
    for handle in driver.window_handles:
        if handle != main_window_handle:
            signin_window_handle = handle
            break

# switch to the pop up google sign in page
driver.switch_to.window(signin_window_handle)

driver.find_element_by_xpath('//*[@id="identifierId"]').send_keys("dummyacount1243@gmail.com")
driver.find_element_by_xpath('//*[@id="identifierNext"]/content/span').click()

time.sleep(3)

driver.find_element_by_xpath('//*[@id="password"]/div[1]/div/div[1]/input').send_keys("testPassword")
driver.find_element_by_xpath('//*[@id="passwordNext"]/content/span').click()



try:
    element_present = EC.presence_of_element_located((By.ID, 'element_id'))
except TimeoutException:
    driver.switch_to_window(main_window_handle)

time.sleep(2)

# force the page to timeout to allow google to process the login details and allow the user to login to the account
try:
    element_present = EC.presence_of_element_located((By.ID, 'element_id'))
except TimeoutException:
    #jump back to the main page
    driver.switch_to_window(window_name)

# click the add unit button and input INSE to the input field and click the button
driver.switch_to_window(main_window_handle)
add = driver.find_element_by_id('add')
add.click()
time.sleep(2)
addvalue = driver.find_element_by_id('addvalue')
addvalue.click()
time.sleep(2)
addvalue.send_keys("INSE")
time.sleep(2)
addsubmit = driver.find_element_by_id('addsubmit')
addsubmit.click()
time.sleep(2)

time.sleep(2)
driver.switch_to_window(main_window_handle)
add = driver.find_element_by_id('add')
add.click()
time.sleep(2)
addvalue = driver.find_element_by_id('addvalue')
addvalue.click()
time.sleep(2)
addvalue.send_keys("Another")
time.sleep(2)
addsubmit = driver.find_element_by_id('addsubmit')
addsubmit.click()
time.sleep(2)

driver.switch_to_window(main_window_handle)
time.sleep(2)
log = driver.find_element_by_id('log')
log.click()
time.sleep(2)
lognumber = driver.find_element_by_id('lognumber')
lognumber.clear()
time.sleep(1)
lognumber.send_keys("12")
time.sleep(2)
logsubmit = driver.find_element_by_id('logsubmit')
logsubmit.click()
time.sleep(2)

# click the delete unit button to delete a unit
driver.switch_to_window(main_window_handle)
driver.find_element_by_xpath('//*[@id="delete"]').click()
time.sleep(2)
driver.find_element_by_xpath('//*[@id="delsubmit"]').click()
time.sleep(2)

driver.switch_to_window(main_window_handle)
time.sleep(2)
driver.find_element_by_xpath('//*[@id="delete"]').click()
time.sleep(2)
driver.find_element_by_xpath('//*[@id="delsubmit"]').click()
time.sleep(2)

driver.switch_to_window(main_window_handle)
time.sleep(2)
info = driver.find_element_by_id('info')
info.click()
time.sleep(2)
driver.find_element_by_xpath('/html/body/main/section[2]/button').click()

# click the sign out button to sign out
driver.find_element_by_xpath('//*[@id="signout"]/a').click()
