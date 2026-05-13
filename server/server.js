const authRoutes = require("./routes/authRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


const userRoutes     = require("./routes/userRoutes");
const providerRoutes = require("./routes/providerRoutes");


app.use("/api/users",     userRoutes);
app.use("/api/providers", providerRoutes);


app.use("/api/auth", authRoutes);

app.use(notFound);       // 404 handler
app.use(errorHandler);   // global error handler (always last)