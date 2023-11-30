//@access Private
//@route POST /api/gpt
const OpenAI = require("openai");
const AppError = require("../models/errorModel");

const openai = new OpenAI({
  apiKey: "",
});

const getGptAnswer = async (req, res, next) => {
  try {
    /* we need to use try catch block to handle error that might occur due to third party api's or packages such as mongoose which is not handled/caught by express's default error handler */

    /* we need to use the next() function to pass the error to the error handling middleware in async functions */

    // throw new AppError("Not Implemente", 501); // this line may not work in async functions, hence we will have to use the next() function and make sure to use the return before it if we dont want the code below it to execute

    return next(
      new AppError("Not Implemente", 501)
    ); /*execution of this file ends here, "even the catch block is not executed as we returned the statement" */

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: req.body.ques,
      max_tokens: 7,
      temperature: 0,
    });

    console.log(req.body.ques);
    console.log(completion.choices[0].text);

    res
      .status(200)
      .json({ message: "gpt answer", answer: completion.choices[0].text });
  } catch (error) {
    console.error("status: " + error.status);
    console.error("message: " + error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
    next(error); // Pass the error to the next error handling middleware
  }
};

module.exports = { getGptAnswer };
