import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import sleep from "sleep-promise";
import { getConfig } from "@buttercup/generator";
import { GeneratorUserInterface } from "../../src/components/generator.js";

describe("generator", function() {
    beforeEach(function() {
        this.rootContainer = document.createElement("div");
        document.body.appendChild(this.rootContainer);
    });

    afterEach(function() {
        document.body.removeChild(this.rootContainer);
        this.rootContainer = null;
    });

    describe("with default options", function() {
        beforeEach(async function() {
            act(() => {
                ReactDOM.render(<GeneratorUserInterface />, this.rootContainer);
            });
            await sleep(100);
        });

        it("renders a random string immediately", function() {
            const passContainer = this.rootContainer.querySelector(".generated-password");
            const password = passContainer.innerText;
            expect(password).to.be.a("string").and.to.have.length.above(0);
        });

        it("renders a random string with the correct length", function() {
            const passContainer = this.rootContainer.querySelector(".generated-password");
            const password = passContainer.innerText;
            expect(password).to.have.lengthOf(getConfig().randomCharacters.length);
        });

        it("generates a new password when 'Generate' button clicked", async function() {
            const password1 = this.rootContainer.querySelector(".generated-password").innerText;
            this.rootContainer.querySelector("button.generate-button").click();
            await sleep(150);
            const password2 = this.rootContainer.querySelector(".generated-password").innerText;
            expect(password1).to.not.equal(password2);
            expect(password2).to.have.length.above(0);
        });
    })
});
