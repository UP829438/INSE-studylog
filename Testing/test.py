from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time 

chrome_options = Options()

chrome_options.add_argument('--start-maximized')    

driver = webdriver.Chrome('./chromedriver', chrome_options = chrome_options)

driver.get('http://up823183.myvm.port.ac.uk/')

time .sleep(3)
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

driver.switch_to.window(signin_window_handle)

driver.find_element_by_xpath('//*[@id="identifierId"]').send_keys("up823183@myport.ac.uk")
driver.find_element_by_xpath('//*[@id="identifierNext"]/content/span').click()

time.sleep(3) 

driver.find_element_by_xpath('//*[@id="password"]/div[1]/div/div[1]/input').send_keys("jessicajung0418")
driver.find_element_by_xpath('//*[@id="passwordNext"]/content/span').click()

try:
    element_present = EC.presence_of_element_located((By.ID, 'element_id'))
except TimeoutException:
    driver.switch_to_window(window_name)


add = driver.find_element_by_xpath('//*[@id="add"]')
add.click()
time.sleep(1)
driver.find_element_by_xpath('//*[@id="addvalue"]').click()
time.sleep(1)
driver.find_element_by_xpath('//*[@id="addvalue"]').send_keys("INSE")
time.sleep(1)
driver.find_element_by_xpath('//*[@id="addsubmit"]').click()
time.sleep(1)
driver.find_element_by_xpath('//*[@id="add"]').click()

driver.find_element_by_xpath('//*[@id="log"]').click()
driver.find_element_by_xpath('//*[@id="lognumber"]').send_keys("12")
driver.find_element_by_xpath('//*[@id="logsubmit"]').click()
driver.find_element_by_xpath('//*[@id="log"]').click()

driver.find_element_by_xpath('//*[@id="delete"]').click()
driver.find_element_by_xpath('//*[@id="delsubmit"]').click()
driver.find_element_by_xpath('//*[@id="delete"]').click()

driver.find_element_by_xpath('//*[@id="info"]').click()
driver.find_element_by_xpath('/html/body/main/section[2]/button').click()

driver.find_element_by_xpath('//*[@id="signout"]/a').click()







