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

# open the link to the webpage
driver.get('http://up823183.myvm.port.ac.uk/')

time .sleep(3)

# function to allow the script to continue on the google signin pop up
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

# find the email input field and insert the email into the field
driver.find_element_by_xpath('//*[@id="identifierId"]').send_keys("email)
driver.find_element_by_xpath('//*[@id="identifierNext"]/content/span').click()

#give it pause to allow google to recongize is the email valid or not
time.sleep(3)

# find the password input field and insert the password into the field
driver.find_element_by_xpath('//*[@id="password"]/div[1]/div/div[1]/input').send_keys("password")
driver.find_element_by_xpath('//*[@id="passwordNext"]/content/span').click()

# force the page to timeout to allow google to prcoess the login details and allow the user to login to the account
try:
    element_present = EC.presence_of_element_located((By.ID, 'element_id'))
except TimeoutException:
    #jump back to the main page
    driver.switch_to_window(window_name)

# click the add unit button and input INSE to the input field and click the button
add = driver.find_element_by_xpath('//*[@id="add"]')
add.click()
time.sleep(1)
driver.find_element_by_xpath('//*[@id="addvalue"]').click()
time.sleep(1)
driver.find_element_by_xpath('//*[@id="addvalue"]').send_keys("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
time.sleep(1)
driver.find_element_by_xpath('//*[@id="addsubmit"]').click()
time.sleep(1)
driver.find_element_by_xpath('//*[@id="add"]').click()

# click the log hours button and input 12 to the input field and click the button
driver.find_element_by_xpath('//*[@id="log"]').click()
driver.find_element_by_xpath('//*[@id="lognumber"]').send_keys("24")
driver.find_element_by_xpath('//*[@id="logsubmit"]').click()
driver.find_element_by_xpath('//*[@id="log"]').click()

# click the delete unit button to delete a unit
driver.find_element_by_xpath('//*[@id="delete"]').click()
driver.find_element_by_xpath('//*[@id="delsubmit"]').click()
driver.find_element_by_xpath('//*[@id="delete"]').click()

# click the about us page to access the information
driver.find_element_by_xpath('//*[@id="info"]').click()
# click the go back button to return to the main page
driver.find_element_by_xpath('/html/body/main/section[2]/button').click()

# click the sign out button to sign out
driver.find_element_by_xpath('//*[@id="signout"]/a').click()
