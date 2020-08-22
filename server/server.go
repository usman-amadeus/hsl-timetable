package main

import (
    "log"
    "net/http"
    "os"
)

func main() {
    /*
        Grab the environment variable that has been hopefully set, but also set up a default
    */
    port := os.Getenv("PORT")
    defaultPort := "8080"
    /*
        Serve the contents of the build directory that was produced as a part of `npm run build` on the root `/`
    */
    http.Handle("/", http.FileServer(http.Dir("./build")))

    /*
        Check if the port environment variable has been set and if so, use that, otherwise let's use a reasonable default
    */
    if !(port == "") {
        log.Fatal(http.ListenAndServe(":"+port, nil))
    } else {
        log.Fatal(http.ListenAndServe(":"+defaultPort, nil))
    }
}