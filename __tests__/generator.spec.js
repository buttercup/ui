import React from "react";
import "jest-styled-components";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Generator } from "../src/index.js";

Enzyme.configure({ adapter: new Adapter() });

describe("generator", () => {
    test("renders identical standard", () => {
        const container = mount(
            <Generator autoGenerate={false} isOpen={true}>
                <a />
            </Generator>
        );
        expect(container).toMatchSnapshot();
    });

    test("renders identical copy-mode", () => {
        const container = mount(
            <Generator autoGenerate={false} copyMode isOpen={true}>
                <a />
            </Generator>
        );
        expect(container).toMatchSnapshot();
    });
});
