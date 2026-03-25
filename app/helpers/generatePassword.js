function generateRandomPassword(length) {

  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()-_+=<>?";

 
  const allChars = lowercaseChars + uppercaseChars + numbers + specialChars;

 
  let password = "";


  function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
  }

  
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(numbers);
  password += getRandomChar(specialChars);

  
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars);
  }
  password = password.split("");    
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}


module.exports = generateRandomPassword
